Vue.component('add-task', {
    template: `
    <div class="column">
        <h2>Добавить задачу</h2>
        <div>
            <label>Название задачи <input maxlength="35" minlength="3" v-model="task.name"></label>
            <h3>Подзадачи</h3>
            <div v-for="(subtask, index) in task.subtasks" :key="index">
                <input placeholder="Напиши подзадачу" maxlength="50" minlength="3" v-model="subtask.name">
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
            minSubtasks: 3,
            maxSubtasks: 5
        }
    },
    methods: {
        addSubtask() {
            if (this.task.subtasks.length < 5){
                this.task.subtasks.push({title: "Task " + (this.task.subtasks.length + 1), done: false})
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
            <task v-for="(task, index) in column.tasks" :key="index" :task="task" @done-subtask="doneSubtask(task, $event)"></task>
        </div>
    </div>
    `,
    methods: {
        doneSubtask(task, subtask) {
            let taskIndex = this.column.tasks.indexOf(task);
            let subtaskIndex = task.subtasks.indexOf(subtask);
            this.column.tasks[taskIndex].subtasks[subtaskIndex].done = subtask.done;

            let halfCheckedSubtasks = this.column.tasks[taskIndex].subtasks.filter(subtask => subtask.done).length >= this.column.tasks[taskIndex].subtasks.length / 2;
            if (halfCheckedSubtasks) {
                this.column.tasks = this.column.tasks.filter(t => t !== task);
                this.$emit('move-task', task, 1);
            }

            if (this.column.tasks[taskIndex].subtasks.every(subtask => subtask.done)) {
                this.column.tasks = this.column.tasks.filter(t => t !== task);
                this.$emit('move-task', task, 2);
            }
        }
    }
});

Vue.component('task', {
    props: ['task'],
    template: `
    <div>
    <h2>{{ task.name }}</h2>
    <div v-for="(subtask, index) in task.subtasks" class="subtask" :key="index" :class="{ done: subtask.done }" @click="toggleSubtask(subtask)">
      <input maxlength="45" minlength="3" type="checkbox" v-model="subtask.done"> {{ subtask.name }}
    </div>
  </div>
    `,
    methods: {
        toggleSubtask(subtask) {
            subtask.done = !subtask.done;
            this.$emit('done-subtask', subtask);
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
                tasks: []
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
        },
        moveTask(task, columnIndex) {
            this.columns[columnIndex - 1].tasks = this.columns[columnIndex - 1].tasks.filter(t => t !== task);
            this.columns[columnIndex].tasks.push(task);
            this.saveData();
        }
    },
});