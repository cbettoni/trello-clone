import { Controller } from "@hotwired/stimulus";
import axios from "axios";
import { get, map } from "lodash-es";

export default class extends Controller {
  HEADERS = { 'ACCEPT': 'application/json' };

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
    return `text-white, bg-indigo-600`;
  }

  buildItems(items) {
    return map(items, (item) => {
      return {
        'id': item['id'],
        'title': get(item, 'attributes.title'),
        'class': this.buildClassList(),
        'list-id': get(item, 'attributes.list_id'),
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

  updateListPosition(el) {
    axios.put(`${this.element.dataset.listPositionsApiUrl}/${el.dataset.id}`, {
      position: el.dataset.order - 1
    }, {
      headers: this.HEADERS
    }).then(() => {
    });
  }

  buildKanban(boards) {
    new jKanban({
      element: `#${this.element.id}`,
      boards: boards,
      itemAddOptions: {
        enabled: true,
      },
      buttonClick: (el, boardId) => {
        Turbo.visit(`/lists/${boardId}/items/new`);
      },
      dragendBoard: (el) => {
        this.updateListPosition(el);
      },
      dropEl: (el, target, source, sibling) => {
        console.log('dropEl');
        console.log('dropEl.el', el);
        console.log('dropEl.target', target);
        console.log('dropEl.source', source);
        console.log('dropEl.sibling', sibling);

        const targetItems = Array.from(target.getElementsByClassName('kanban-item'));
        const sourceItems = Array.from(source.getElementsByClassName('kanban-item'));

        console.log('targetItems', targetItems);
        console.log('sourcetItems', sourceItems);

        console.log('target.closest(.kanban-board): ', target.closest('.kanban-board').dataset.id);
        targetItems.forEach((item, index) => {
          item.dataset.position = index;
          item.dataset.listId = target.closest('.kanban-board').dataset.id;
        });
        sourceItems.forEach((item, index) => {
          item.dataset.position = index;
          item.dataset.listId = source.closest('.kanban-board').dataset.id;
        });
      },
    });
  }
}
