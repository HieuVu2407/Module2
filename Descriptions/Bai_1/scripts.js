const $tabs_all = document.getElementById("tabs-all");
const $tabs_completed = document.getElementById("tabs-completed");

const $tabs_active = document.getElementById("tabs-active");
const $tabs_add = document.getElementById("tabs-add");
const $task_list = document.getElementById("task-list");
const $actions_delete = document.getElementById("actions-delete");
const $task_input = document.getElementById("task-input")

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskIds = JSON.parse(localStorage.getItem("taskIds")) || [];

window.add = function(){
    let input = $tabs_add.value;
    let taskId = 0;
    let newTask = {}
    if(input !== ""){
        if(tasks.length === 0){
             newTask = {
                id : 1,
                isCompleted : false,
                name : input
            }
        }
        else{
            taskId = tasks[tasks.length - 1].id;
             newTask = {
                id : taskId + 1,
                isCompleted : false,
                name : input
            }
        }
        
        tasks.push(newTask);
        localStorage.setItem("tasks" , JSON.stringify(tasks))
        $tabs_add.value = ""
    }
    renderListTasks();
}

window.renderListTasks = function(){
    let htmlTask = "";
const tasksCurrent = JSON.parse(localStorage.getItem("tasks")) || [];


    for(let task of tasksCurrent){
        if(!task.isCompleted){
            htmlTask += `
            <li><input onclick="updateTask(${task.id}, this)" type="checkbox" id="task-checkbox${task.id}">
            <span style="text-decoration: none;">${task.name}</span>
            </li>
            `;
        }
        else{
            htmlTask += `
            <li><input onclick="updateTask(${task.id}, this)" type="checkbox" checked id="task-checkbox${task.id}">
            <span style="text-decoration: line-through;">${task.name}</span>
            </li>
            `;
        }
        
    }
    $task_list.innerHTML = htmlTask;
}

window.updateTask = function(taskId, checkbox){

    let taskIndex = tasks.findIndex(x => x.id === taskId);

    if (checkbox.checked){
        if (!taskIds.includes(taskId)) {
            taskIds.push(taskId);
            localStorage.setItem("taskIds" , JSON.stringify(taskIds))

            tasks[taskIndex].isCompleted = true

          }
    }
    else{
        for(let i = 0; i< taskIds.length; i++){
            if(taskIds[i] === taskId){
                taskIds.splice(i,1)
            }
        }
        console.log(taskIndex)
        tasks[taskIndex].isCompleted = false
        
        localStorage.setItem("taskIds" , JSON.stringify(taskIds));
    }
    localStorage.setItem("tasks" , JSON.stringify(tasks));
    renderListTasks();
}

window.deleteTask = function(){

    for(let taskId of taskIds){
        let taskIndex = tasks.findIndex(x => x.id === taskId);
        tasks.splice(taskIndex,1)
    }
    localStorage.setItem("tasks" , JSON.stringify(tasks))
    localStorage.setItem("taskIds" , JSON.stringify([]))
    
    renderListTasks();

}


window.showAll = function(){
    $actions_delete.style.display = "none";
    $tabs_active.style.border = "none";
    $tabs_all.style.borderBottom = "2px solid blue"
    $tabs_completed.style.border = "none"
    $task_input.style.display = "inline"
    renderListTasks();
}

window.showActive = function(){
    $actions_delete.style.display = "none";
    $tabs_active.style.borderBottom = "2px solid blue";
    $tabs_all.style.border = "none"
    $tabs_completed.style.border = "none"
    $task_input.style.display = "inline"

    let newTasks = tasks.filter(x => !taskIds.includes(x.id));
    let htmlTask = "";

    for(let task of newTasks){
        htmlTask += `
    <li><input onclick="updateTask(${task.id}, this)" type="checkbox" id="task-checkbox${task.id}">
    <span >${task.name}</span>
    </li>
    `;
    }
    $task_list.innerHTML = htmlTask;
}

window.showCompleted = function(){
    $actions_delete.style.display = "inline";
    $task_input.style.display = "none"
    $tabs_active.style.border = "none";
    $tabs_all.style.border = "none"
    $tabs_completed.style.borderBottom = "2px solid blue"
    $actions_delete.innerHTML = `<button onclick="deleteTask()" >Delete all</button>`

    let newTasks = [];

    let htmlTask = "";

    for(let task of tasks){
        if(task.isCompleted){
            newTasks.push(task)
        }
    }

    for(let task of newTasks){
        htmlTask += `
    <li><input onclick="updateTask(${task.id}, this)" type="checkbox" checked id="task-checkbox${task.id}">
    <span style="text-decoration: line-through;">${task.name}</span>
    </li>
    `;
    }
    $task_list.innerHTML = htmlTask;
}

renderListTasks();