import { Controller } from "@hotwired/stimulus";
import axios from "axios";
import { get, map, sample } from "lodash-es";

export default class extends Controller {
  HEADERS = { 'ACCEPT': 'application/json' };
  BACKGROUND_COLORS = ['bg-indigo-900', 'bg-indigo-700', 'bg-indigo-600', 'bg-indigo-500', 'bg-indigo-300'];

  getHeaders() {
    return Array.from(document.getElementsByClassName('kanban-board-header'));
  }

  getHeaderTitles() {
    return Array.from(document.getElementsByClassName('kanban-title-board'));
  }

  cursorifyHeaderTitles() {
    this.getHeaderTitles().forEach((headerTitle) => {
      headerTitle.classList.add('cursor-pointer');
    });
  }

  addLinkToHeaderTitles(boards) {
    this.getHeaderTitles().forEach((headerTitle, index) => {
      headerTitle.addEventListener('click', () => {
        Turbo.visit(`${this.element.dataset.boardListsUrl}/${boards[index].id}/edit`);
      });
    });
  }

  buildBoardDeleteButton(boardId) {
    const button = document.createElement('button');
    button.classList.add('kanban-title-button');
    button.classList.add('btn');
    button.classList.add('btn-default');
    button.classList.add('btn-xs');
    button.classList.add('ml-2');
    button.textContent = 'x';
    button.addEventListener('click', (e) => {
      e.preventDefault();

      console.log('button clicked wuth board ID: ', boardId);

      axios.delete(`${this.element.dataset.boardListsUrl}/${boardId}`, {
        headers: this.HEADERS
      }).then((_) => {
        Turbo.visit(window.location.href);
      });
    });
    return button;
  };

  addHeaderDeleteButton(boards) {
    this.getHeaderTitles().forEach((header, index) => {
      header.appendChild(this.buildBoardDeleteButton(boards[index].id));
    });
  }

  connect() {
    axios.get(this.element.dataset.apiUrl, { headers: this.HEADERS }).then((response) => {
      this.buildKanban(this.buildBoards(response['data']));
      this.cursorifyHeaderTitles();
      this.addLinkToHeaderTitles(this.buildBoards(response['data']));
      this.addHeaderDeleteButton(this.buildBoards(response['data']));
    });
  }

  buildClassList(classList) {
    return `text-white, ${sample(this.BACKGROUND_COLORS)}`;
  }

  buildItems(items) {
    return map(items, (item) => {
      return {
        'id': item['id'],
        'title': get(item, 'attributes.title'),
        'class': this.buildClassList(),
      }
    });
  }

  buildBoards(boardsData) {
    return map(boardsData['data'], (board) => {
      return {
        'id': get(board, 'id'),
        'title': get(board, 'attributes.title'),
        'class': this.buildClassList(),
        'item': this.buildItems(get(board, 'attributes.items.data')),
      }
    });
  }

  buildKanban(boards) {
    new jKanban({
      element: `#${this.element.id}`,
      boards: boards,
      itemAddOptions: {
        enabled: true,
      },
      buttonClick: () => {
        console.log('board clicked');
      },
    });
  }
}
