class HeaderDOM {
    render()
    {
        const element = document.createElement('header');
        element.classList.add('header');

        return element;
    }
}

class OutputDOM {
    render() {
        const list = document.createElement('ol');
        list.classList.add('list');

        const element = document.createElement('div');
        element.classList.add('output');
        element.append(list);

        Events.onAddToList(_ => {
            const listItem = document.createElement('li');
            listItem.innerText = _.detail.figure.label;
            list.append(listItem);
        });

        return element;
    }
}

class FieldsDOM {
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

class OptionsDOM {
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

    createRepeatCheckbox()
    {
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

class ActionsDOM {
    render() {
        const clean = this.createButton('clean', 'clean', 'Clean');
        const add = this.createButton('add', 'add', '🎲 Add');
        const add5 = this.createButton('add5', 'add5', 'Add +5');

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

    createButton(id, klass, text)
    {
        const button = document.createElement('button');
        button.classList.add(klass);
        button.id = id;
        button.innerHTML = text;

        return button;
    }
}

class Figure {
    id;
    label;
    description;

    constructor(id, label, description) {
        this.id = id;
        this.label = label;
        this.description = description;
    }
}

class Events {
    static fireAddToList(figure) {
        document.dispatchEvent(new CustomEvent(
            'add-to-list', {
            detail: { figure: figure }
        }))
    }

    static onAddToList(callback) {
        document.addEventListener('add-to-list', callback);
    }

    static fireCheckboxToggle(event) {
        document.dispatchEvent(new CustomEvent(
            'checkbox-toggle', {
            detail: {
                id: event.target.dataset.id,
                checked: event.target.checked
            }
        }))
    }

    static onCheckboxToggle(callback) {
        document.addEventListener('checkbox-toggle', callback);
    }
}

class FigureField
{
    /**
     * @param {Figure} figure 
     */
    render(figure)
    {
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

class Store 
{
    figuresCheckMap = {};
    figures = {};
    renderedList = [];

    init()
    {
        Events.onCheckboxToggle(
            _ => {
                this.figuresCheckMap[parseInt(_.detail.id)] = _.detail.checked
                const activeFigures = Object.keys(this.figuresCheckMap).filter(_ => this.figuresCheckMap[_]);
                const classList = document.querySelector('.fields fieldset').classList;

                if (activeFigures.length === 0) {
                    classList.add('error');
                } else {
                    classList.remove('error');
                }
            }
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

    addToList(id)
    {
        this.renderedList.push(id);
        Events.fireAddToList(this.figures[id]);
    }

    getRandomFigure() {
        const activeFigures = Object.keys(this.figuresCheckMap).filter(_ => this.figuresCheckMap[_]);

        return activeFigures[Math.floor((Math.random() * activeFigures.length))];
    }
}

class App
{
    appContainer;
    /**
     * @var {Store}
     */
    store;
    async init()
    {
        this.appContainer = document.getElementById('app');
        this.store = (new Store()).init();
        const response = await fetch("/salsa/data.json");
        const data = await response.json();
        data.data.forEach(_ => this.store.add(new Figure(_.id, _.label, _.description)));
        
        return this;
    }

    render()
    {
        const header = (new HeaderDOM()).render();
        const fieldsDOM = (new FieldsDOM()).render();
        const fieldset = fieldsDOM.querySelector('fieldset');

        this._renderFields().forEach(_ => fieldset.append(_));

        header.append(fieldsDOM);
        header.append((new OptionsDOM()).render());
        header.append((new ActionsDOM()).render());

        this.appContainer.append(header);

        this.appContainer.append((new OutputDOM()).render());

        return this;
    }

    initListeners()
    {
        document.querySelector('#add').addEventListener('click', _ => {
            this.store.addToList(this.store.getRandomFigure());
        });
    }

    _renderFields()
    {
        return Object.values(this.store.figures)
            .map(figure => (new FigureField()).render(figure));
    }
}

const app = new App();
app.init().then(() => app.render().initListeners());