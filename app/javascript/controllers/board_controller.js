import { Controller } from "@hotwired/stimulus";
import axios from "axios";
import { get, map, sample } from "lodash-es";

export default class extends Controller {
  HEADERS = { 'ACCEPT': 'application/json' };
  BACKGROUND_COLORS = ['bg-indigo-900', 'bg-indigo-700', 'bg-indigo-600', 'bg-indigo-500', 'bg-indigo-300'];

  connect() {
    axios.get(this.element.dataset.apiUrl, { headers: this.HEADERS }).then((response) => {
      this.buildKanban(this.buildBoards(response['data']));
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
        enabled: true,                                       // add a button to board for easy item creation
      },
    });
  }
}
