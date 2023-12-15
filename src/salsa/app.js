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

        return element;
    }
}

class FieldsDOM {
    render() {
        const element = document.createElement('div');
        element.classList.add('fields');

        return element;
    }
}

class OptionsDOM {
    render() {
        const element = document.createElement('div');
        element.classList.add('options');

        return element;
    }
}

class ActionsDOM {
    render() {
        const clean = this.createButton('clean', 'clean', 'Clean');
        const add = this.createButton('add', 'add', 'Add');
        const add5 = this.createButton('add5', 'add5', 'Add +5');
        const add10 = this.createButton('add10', 'add10', 'Add +10');

        const element = document.createElement('div');
        element.classList.add('actions');
        element.append(clean);
        element.append(add);
        element.append(add5);
        element.append(add10);

        return element;
    }

    createButton(id, klass, text)
    {
        const button = document.createElement('button');
        button.classList.add(klass);
        button.id = id;
        button.innerText = text;

        return button;
    }
}

class Figure {
    id;
    label;

    constructor(id, label) {
        this.id = id;
        this.label = label;
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
        labelElement.innerText = figure.label;
        wrapperElement.append(checkboxElement);

        wrapperElement.append(labelElement);

        return wrapperElement;
    }
}

class FigureFields
{
    fields = [];

    constructor(fields)
    {
        this.fields = fields;
    }

    init(data)
    {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');

        legend.innerText = 'Figures';
        fieldset.append(legend);

        return fieldset;
    }
}

class App
{
    appContainer;
    figures;
    init()
    {
        this.appContainer = document.getElementById('app');
        // this.figures = (new FigureFields(fields));
        // fetch("/salsa/data.json")
        //     .then( (data) => data.json().then((data) => {
        //         this.renderFields(data)
        //     }));
        
        return this;
    }

    render()
    {
        const header = (new HeaderDOM()).render();

        header.append((new FieldsDOM()).render());
        header.append((new OptionsDOM()).render());
        header.append((new ActionsDOM()).render());

        this.appContainer.append(header);

        this.appContainer.append((new OutputDOM).render());
    }

    renderFields(fields)
    {
        this.appContainer.append(this.figures.init());

        fields.forEach(field => {
            const figure = new Figure(field.id, field.label);
            this.figures.push(new Figure(field.id, field.label));
            (new FigureField(this.appContainer)).init(figure);
        });
    }

    getRandomFigure()
    {
        return this.figures[Math.floor((Math.random() * this.figures.length))];
    }
}

(new App()).init().render();

// document.querySelector('#add').addEventListener('click', () => {
//     const figure = app.getRandomFigure();
//     const listItem = document.createElement('li');
//     listItem.innerText = figure.label;

//     document.querySelector('.output').querySelector('.list').append(listItem);
// });