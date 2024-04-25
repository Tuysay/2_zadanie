Vue.component('add-task', {
    template: `
    <div class="column">
        <h2>Добавить задачу</h2>
        <div>
            <label>Название задачи <input v-model="task.name"></label>
            <h3>Подзадачи</h3>
            <div v-for="(subtask, index) in task.subtasks" :key="index">
                <input v-model="subtask.name">
                <button @click="delSubtask(index)">-</button>
            </div>
            <button @click="addSubtask">+</button>
            <button @click="addTask" :disabled="task.subtasks.length === 0 || $parent.column1Full">Добавить</button>
        </div>
    </div>
    `,
    methods: {
        addSubtask() {
            if (this.task.subtasks.length < 5) {
                this.task.subtasks.push({ name: "Пункт " + (this.task.subtasks.length + 1), done: false });
            } else {
                alert("Вы достигли максимального количества подзадач в этом столбце!");
            }
        },
        delSubtask(index) {
            this.task.subtasks.splice(index, 1);
        },
        addTask() {
            if (this.task.subtasks.length === 0) {
                alert("Нельзя создать задачу без подзадач!");
                return;
            }
            this.$emit('add-task', JSON.parse(JSON.stringify(this.task)));
            this.task.name = 'Новая задача';
            this.task.subtasks = [];
        }
    },
    data() {
        return {
            task: {
                name: 'Новая задача',
                subtasks: []
            }
        }
    },
})
Vue.component('column', {
    props: ['column'],
    template: `
    <div class="column">
        <h2>{{column.name}}</h2>
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
})
Vue.component('task', {
    props: ['task'],
    template: `
    <div>
        <h2>{{task.name}}</h2>
        <div v-for="(subtask, index) in task.subtasks" class="subtask" :key="index" :class="{done:subtask.done}" @click="doneSubtask(subtask)">
            <input type="checkbox" v-model="subtask.done"> 
            <span :class="{ 'completed': subtask.done }">{{subtask.name}}</span>
        </div>
    </div>
    `,
    methods: {
        doneSubtask(subtask) {
            this.$emit('done-subtask', subtask)
        }
    }
})

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
    methods: {
        saveData() {
            localStorage.setItem('columns', JSON.stringify(this.columns))
        },
        addTask(task) {
            this.columns[0].tasks.push(task)
            this.saveData()
        }
    },
})
// let app = new Vue({
//     el: '#app',
//     data: {
//         product: "To_DO_list",
//         image: "./assets/summer-routine.png",
//         altText: "A pair of socks",
//         inStock: true
//     }
//
// })


