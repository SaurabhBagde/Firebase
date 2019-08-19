const lists = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

// html injecting func to dom
const addRecipe= (recipe,id)=>{

    let html = `
    <li data-id ="${id}">
    <div>${recipe.title} on ${recipe.created_on.toDate()}</div>
    <button class= "btn btn-danger btn-sm my-2 ">Delete</button>
    </li>`;
lists.innerHTML += html;

}

// removing elements from dom
const deleteRecipe= id=>{
    const recipes = document.querySelectorAll('li');
    recipes.forEach(recipe=>{
    if(recipe.getAttribute('data-id')===id)
    {
        recipe.remove();
    }
})
}


//           OLD
//Getting data from database & passing it to html injecting func
// db.collection('recipes').get()
// .then(snapshot=>{
//     snapshot.docs.forEach(doc => {
//         addRecipe(doc.data(), doc.id);
//      });
// })
// .catch(err=>console.log(err));
//            NEW
// realtime update on dom

const unsub = db.collection('recipes').onSnapshot(snapshot=>{

    snapshot.docChanges().forEach( change => {
        const doc = change.doc;
        
        if(change.type==='added'){
            addRecipe(doc.data(), doc.id);
        }else if(change.type==='removed'){
             deleteRecipe(doc.id);
        }
        
    });
})

// Adding to database
form.addEventListener('submit', e=>{
    e.preventDefault();
    const now = new Date();
    const recipe = {
        title: form.recipe.value,
        created_on: firebase.firestore.Timestamp.fromDate(now)
    }
    db.collection('recipes').add(recipe).then(()=> console.log("recipe added to database")).catch(e=> console.log(e));
});

//Deleteing from database
lists.addEventListener('click',e=>{
   // console.log(e.target);
    if(e.target.tagName==='BUTTON'){

     const id = e.target.parentElement.getAttribute('data-id')
     db.collection('recipes').doc(id).delete().then(()=> console.log('Recipe deleted')).catch(e=> console.log(e));
    }
})

//Unsubscribe fro changes

button.addEventListener('click', e=>{
    unsub();
    console.log('Unsubed from database')
})