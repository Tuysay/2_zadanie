
Vue.component("product", {
    template: `
        <div class="card">
            {{ product.text }}
            <input type="text" v-model="product.newTask" placeholder="Add new task">
            <button @click="addTask">Add Task</button>
            <div class="task" v-for="(task, index) in product.tasks" :key="index">{{ task }}</div>
        </div>
    `,
    props: ['product'],
    methods: {
        addTask() {
            if (this.product.tasks.length < this.product.maxTasks) {
                if (this.product.newTask.trim() !== '') {
                    this.product.tasks.push(this.product.newTask.trim());
                    this.product.newTask = '';
                }
            }
        }
    }
});

let app = new Vue({
    el: "#app",
    data: {
        image: "./assets/summer-routine.png",
        altText: "Logo",
        columns: [
            { title: 'Column 1 (max 3)', maxTasks: 3, tasks: [], newTask: '' },
            { title: 'Column 2 (max 5)', maxTasks: 5, tasks: [], newTask: '' },
            { title: 'Column 3 (unlimited)', maxTasks: Infinity, tasks: [], newTask: '' }
        ]
    }
});
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


