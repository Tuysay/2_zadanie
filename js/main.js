Vue.component('add-task', {
    template: `
    <div class="column">
        <h2>Добавить задачу</h2>
        <div>
            <label>Название задачи <input maxlength="35" minlength="3" v-model="task.name"></label>
            <h3>Подзадачи</h3>
            <div v-for="(subtask, index) in task.subtasks" :key="index">
                <input maxlength="50" minlength="3" v-model="subtask.name">
                <button @click="delSubtask(index)">-</button>
            </div>
            <button @click="addSubtask" :disabled="task.subtasks.length >= maxSubtasks">+</button>
            <button @click="addTask">Добавить</button>
        </div>
    </div>
    `,
    data() {
        return {
            task: {
                name: 'Новая задача',
                subtasks: []
            },
            maxSubtasks: 5
        }
    },
    methods: {
        addSubtask() {
            if (this.task.subtasks.length < this.maxSubtasks) {
                this.task.subtasks.push({ name: "Пункт " + (this.task.subtasks.length + 1), done: false });
            } else {
                alert("Вы достигли максимального количества подзадач в этом столбце!");
            }
        },
        delSubtask(index) {
            this.task.subtasks.splice(index, 1);
        },
        addTask() {
            if (!this.task.name) {
                alert('Необходимо заполнить заголовок задачи.');
                return;
            }
            if (this.task.subtasks.length === 0 || !this.task.subtasks.every(subtask => subtask.name)) {
                alert('Все задачи должны иметь хотя бы одну подзадачу и название.');
                return;
            }

            let newTask = {
                name: this.task.name,
                subtasks: this.task.subtasks.map(subtask => ({ name: subtask.name, done: false }))
            };
            this.$emit('add-task', newTask);

            this.task.name = 'Новая задача';
            this.task.subtasks = [];
        }
    },

});
Vue.component('column', {
    props: ['column'],
    template: `
    <div class="column">
        <h2>{{ column.name }}</h2>
        <div class="task">
            <task v-for="(task, index) in column.tasks" :key="index" :task="task" @done-subtask="doneSubtask"></task>
        </div>
    </div>
    `,
    methods: {
        doneSubtask(subtask) {
            this.$emit('done-subtask', subtask)
        }
    }
});

Vue.component('task', {
    props: ['task'],
    template: `
    <div>
        <h2>{{task.name}}</h2>
        <div v-for="(subtask, index) in task.subtasks" class="subtask" :key="index" :class="{done:subtask.done}" @click="toggleSubtask(subtask)">
            <input maxlength="45" minlength="3" type="checkbox" v-model="subtask.done"> {{subtask.name}}
        </div>
    </div>
    `,
    methods: {
        doneSubtask(subtask) {
            this.$emit('done-subtask', subtask);
        },
        deleteAllTasks() {
            this.column.tasks = [];
            // Добавим также сохранение данных после удаления
            this.$emit('save');
        }
    },
    computed: {
        isFirstColumn() {
            return this.column.index === 0;
        }
    }
});
let app = new Vue({
    el: '#app',
    data: {
        name: "Vue To Do list",
        columns: [
            {
                name: "Новые задачи",
                tasks: [
                    {
                        name: "Задача 1",
                        subtasks: [
                            { name: "Пункт 1.1", done: true },
                            { name: "Пункт 1.2", done: false },
                            { name: "Пункт 1.3", done: false },
                            { name: "Пункт 1.4", done: false },
                            { name: "Пункт 1.5", done: false },
                        ]
                    },
                ]
            },
            {
                name: "В процессе",
                tasks: []
            },
            {
                name: "Закончено",
                tasks: []
            }
        ]
    },
    mounted() {
        if (localStorage.columns) {
            this.columns = JSON.parse(localStorage.columns);
        }
    },
    watch: {
        columns: {
            handler: function (val) {
                localStorage.columns = JSON.stringify(val);
            },
            deep: true
        }
    },
    methods: {
        saveData() {
            localStorage.setItem('columns', JSON.stringify(this.columns))
        },
        addTask(task) {
            if (!task.subtasks.every(subtask => subtask.name)) {
                alert("Все задачи должны иметь хотя бы одну подзадачу.");
                return;
            }
            if (this.columns[0].tasks.length < 3) {
                this.columns[0].tasks.push(task);
                this.saveData();
            } else {
                alert("Вы достигли максимального количества задач в этом столбце!");
            }
            // if (this.columns[1].tasks.length < 5) {
            //     this.columns[1].tasks.push(task);
            // }

        }
    },
});
