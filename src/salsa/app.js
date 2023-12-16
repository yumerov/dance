/**
 * Represents page's header section DOM
 */
class HeaderDOM {
  /**
     * @return {HTMLElement}
     */
  render() {
    const element = document.createElement('header');
    element.classList.add('header');

    return element;
  }
}

/**
 * Represents output list's DOM
 */
class OutputDOM {
  /**
   * @return {HTMLOListElement}
   */
  render() {
    const list = document.createElement('ol');
    list.classList.add('list');

    const element = document.createElement('div');
    element.classList.add('output');
    element.append(list);

    Events.onAddToList((_) => {
      const listItem = document.createElement('li');
      listItem.innerText = _.detail.figure.label;
      list.append(listItem);
    });

    return element;
  }
}

/**
 * Manages fields section in DOM
 */
class FieldsDOM {
  /**
   * @return {HTMLDivElement}
   */
  render() {
    const element = document.createElement('div');
    element.classList.add('fields');
    element.classList.add('column');

    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');

    legend.innerText = 'Figures';
    fieldset.append(legend);

    element.append(fieldset);

    return element;
  }
}

/**
 * Manages options section in DOM
 */
class OptionsDOM {
  /**
   * @return {HTMLDivElement}
   */
  render() {
    const element = document.createElement('div');
    element.classList.add('options');
    element.classList.add('column');

    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');

    legend.innerText = 'Options';
    fieldset.append(legend);

    fieldset.append(this.createRepeatCheckbox());

    element.append(fieldset);

    return element;
  }

  /**
   * @return {HTMLLabelElement}
   */
  createRepeatCheckbox() {
    const wrapperElement = document.createElement('label');
    const maxRepeats = document.createElement('input');
    const labelElement = document.createElement('span');

    maxRepeats.setAttribute('type', 'number');
    maxRepeats.value = 3;
    maxRepeats.setAttribute('min', 0);
    maxRepeats.setAttribute('max', 5);
    labelElement.innerText = 'Max repeats: ';

    wrapperElement.append(labelElement);
    wrapperElement.append(maxRepeats);

    return wrapperElement;
  }
}

/**
 * Manages action items in DOM
 */
class ActionsDOM {
  /**
     * @return {HTMLDivElement}
     */
  render() {
    // const clean = this.createButton('clean', 'clean', 'Clean');
    const add = this.createButton('add', 'add', '🎲 Add');
    // const add5 = this.createButton('add5', 'add5', 'Add +5');

    const element = document.createElement('div');
    element.classList.add('actions');
    element.classList.add('column');

    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');

    legend.innerText = 'Actions';
    fieldset.append(legend);

    // fieldset.append(clean);
    fieldset.append(add);
    // fieldset.append(add5);

    element.append(fieldset);

    return element;
  }

  /**
   * @param {string} id
   * @param {string} klass
   * @param {string} text
   * @return {HTMLButtonElement}
   */
  createButton(id, klass, text) {
    const button = document.createElement('button');
    button.classList.add(klass);
    button.id = id;
    button.innerHTML = text;

    return button;
  }
}

/**
 * Figure DTO
 */
class Figure {
  id;
  label;
  description;

  /**
   * @param {int} id
   * @param {string} label
   * @param {string|null} description
   */
  constructor(id, label, description) {
    this.id = id;
    this.label = label;
    this.description = description;
  }
}

/**
 * Wrapping app events
 */
class Events {
  /**
   * @param {Figure} figure
   */
  static fireAddToList(figure) {
    document.dispatchEvent(new CustomEvent(
        'add-to-list', {
          detail: {figure: figure},
        }));
  }

  /**
   * @param {Function} callback
   */
  static onAddToList(callback) {
    document.addEventListener('add-to-list', callback);
  }

  /**
   * @param {Event} event
   */
  static fireCheckboxToggle(event) {
    document.dispatchEvent(new CustomEvent(
        'checkbox-toggle', {
          detail: {
            id: event.target.dataset.id,
            checked: event.target.checked,
          },
        }));
  }

  /**
   * @param {Function} callback
   */
  static onCheckboxToggle(callback) {
    document.addEventListener('checkbox-toggle', callback);
  }
}

/**
 * Renderers a single figure field
 */
class FigureField {
  /**
   * @param {Figure} figure
   * @return {HTMLLabelElement}
   */
  render(figure) {
    const wrapperElement = document.createElement('label');
    const checkboxElement = document.createElement('input');
    const labelElement = document.createElement('span');

    checkboxElement.setAttribute('type', 'checkbox');
    checkboxElement.checked = true;
    checkboxElement.dataset.id = figure.id;
    checkboxElement.onchange = Events.fireCheckboxToggle;
    labelElement.innerText = figure.label;
    wrapperElement.append(checkboxElement);

    wrapperElement.append(labelElement);

    if (figure.description) {
      wrapperElement.dataset.description = figure.description;
      wrapperElement.classList.add('tooltip');
    }

    return wrapperElement;
  }
}

/**
 * Central store class managing the state
 */
class Store {
  figuresCheckMap = {};
  figures = {};
  renderedList = [];

  /**
   * Inits the listeners
   *
   * @return {Store}
   */
  init() {
    Events.onCheckboxToggle(
        (_) => {
          const map = this.figuresCheckMap;
          map[parseInt(_.detail.id)] = _.detail.checked;
          const activeFigures = Object.keys(map).filter((_) => map[_]);
          const fieldset = document.querySelector('.fields fieldset');

          if (activeFigures.length === 0) {
            fieldset.classList.add('error');
          } else {
            fieldset.classList.remove('error');
          }
        },
    );

    return this;
  }

  /**
     * @param {Figure} figure
     */
  add(figure) {
    this.figuresCheckMap[figure.id] = true;
    this.figures[figure.id] = figure;
  }

  /**
   * Fires the event
   *
   * @param {int} id
   */
  addToList(id) {
    this.renderedList.push(id);
    Events.fireAddToList(this.figures[id]);
  }

  /**
   * Returns a random available figure id
   *
   * @return {int}
   */
  getRandomFigure() {
    const map = this.figuresCheckMap;
    const activeFigures = Object.keys(map).filter((_) => map[_]);

    return activeFigures[Math.floor((Math.random() * activeFigures.length))];
  }
}

/**
 * Represents the application managing the state and behavior
 */
class App {
  appContainer;
  /**
     * @var {Store}
     */
  store;

  /**
   * Loads the dance data and fills the store
   *
   * @return {App}
   */
  async init() {
    this.appContainer = document.getElementById('app');
    this.store = (new Store()).init();
    const response = await fetch('/salsa/data.json');
    const data = await response.json();
    data.data.forEach((_) => {
      this.store.add(new Figure(_.id, _.label, _.description));
    });

    return this;
  }

  /**
   * Renders all needed DOM elements
   *
   * @return {HTMLDivElement}
   */
  render() {
    const header = (new HeaderDOM()).render();
    const fieldsDOM = (new FieldsDOM()).render();
    const fieldset = fieldsDOM.querySelector('fieldset');

    this._renderFields().forEach((_) => fieldset.append(_));

    header.append(fieldsDOM);
    header.append((new OptionsDOM()).render());
    header.append((new ActionsDOM()).render());

    this.appContainer.append(header);

    this.appContainer.append((new OutputDOM()).render());

    return this;
  }

  /**
   * Inits listeners
   */
  initListeners() {
    document.querySelector('#add').addEventListener('click', (_) => {
      this.store.addToList(this.store.getRandomFigure());
    });
  }

  /**
   * Returns list of labeled figure checkboxes
   *
   * @return {HTMLDivElement[]}
   */
  _renderFields() {
    return Object.values(this.store.figures)
        .map((figure) => (new FigureField()).render(figure));
  }
}

const app = new App();
app.init().then(() => app.render().initListeners());
