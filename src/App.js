import React from "react";
import './App.css';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          items: [],
          inputValue: '',
          DataisLoaded: false
      };
      this.printGroceryList = this.printGroceryList.bind(this);
      this.clearSearch = this.clearSearch.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.submitSearch = this.submitSearch.bind(this);
    }
    printGroceryList (listId) {   
      console.log(listId);  
      var mywindow = window.open('', 'PRINT', 'height=400,width=600');
      mywindow.document.write('<html><head><title>' + document.title  + '</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write(document.getElementById(listId).innerHTML);
      mywindow.document.write('</body></html>');
      mywindow.document.close();
      mywindow.focus(); 
      mywindow.print();
      mywindow.close();
      return true;
    }

    clearSearch(e) {
      e.preventDefault(); 
      this.setState({
        inputValue: ''
      });
    }
    handleChange(e) {
      const val = e.target.value;   
      this.setState({
        inputValue: val
      });
      console.log(this.state.inputValue);
    }
    submitSearch(e) {
      e.preventDefault();
      let searchTerm = this.state.inputValue.replace(/ /g, '+');
      let params = new URLSearchParams({ 
        type: "public",
        app_id: process.env.REACT_APP_RECIPE_ID, 
        app_key: process.env.REACT_APP_RECIPE_KEY, 
        q: searchTerm
      });
      fetch(`https://api.edamam.com/api/recipes/v2?${params}`).then((res) => res.json()).then((json) => {
        this.setState({
            hits: json.hits,
            DataisLoaded: true,
            inputValue: ''
        });
      })
    }
   
    render() {
        const { DataisLoaded, hits, inputValue } = this.state;
        return (
        <div className = "App">
            <header className="banner">
              <h1>Recipe Grocery List<br />Search Engine</h1>
              <form className="custom-search">
                  <input id="search" type="text" className="input" value={inputValue} onChange={e => this.handleChange(e)} placeholder="Search for a recipe..."/>
                  <button id="search" className="btn-search" onClick={e => this.submitSearch(e)}>Search</button>
                  <button id="clear" className="btn-clear" onClick={e => this.clearSearch(e)}>Clear</button>
              </form>
            </header> 
            <main>
              {!DataisLoaded ? 
                <section className="no-data">
                  <h1>Please search for a recipe to access a printable grocery list.</h1> 
                </section>
                :
                <section className="recipe-container">
                {
                    hits.map((hit,idx) => ( 
                      <article className="recipe-card" key={idx}>
                        <div className="recipe-banner">
                          <div><p>{hit.recipe.label}</p></div>
                          <div className="dish-type">
                            <p>{hit.recipe.dishType}</p>
                          </div>
                        </div>
                        <div className="recipe-sub-banner">
                          <div className="img">
                            <img src={hit.recipe.image} alt={hit.recipe.label} />
                          </div>
                          <div>
                            <p><strong>Instructions</strong>: <a href={hit.recipe.url} target="_blank">{hit.recipe.source}</a></p>
                            <p className="capitalize"><strong>Cuisine</strong>: {hit.recipe.cuisineType}</p>
                            <p><strong>Yield</strong>: {hit.recipe.yield}</p>
                            <p><strong>Total Time</strong>: {hit.recipe.totalTime} minutes</p>
                            <p><strong>Total Calories</strong>: {hit.recipe.calories.toLocaleString().split('.')[0]}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="diet">
                          <div className="title">
                            <p><strong>Diet</strong>:</p>
                          </div>
                          <div>
                            <div className="tag-container">
                              {
                                hit.recipe.dietLabels.map((diet,idx2) => (
                                  <div className="tag tag-sm diet" key={idx2}>{diet}</div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                        <div className="health" style={{paddingBottom:"1rem"}}>
                          <div className="title">
                            <p><strong>Health</strong>:</p>
                          </div>
                          <div>
                            <div className="tag-container">
                              {
                                hit.recipe.healthLabels.map((health,idx3) => (
                                  <div className="tag tag-sm health" key={idx3}>{health}</div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                        <div className="ingredient-list">
                          <button className="noprint" onClick={() => this.printGroceryList("printable-list_" + idx)}>Print Grocery List</button>
                          <div id={"printable-list_" + idx}>
                            <h2>Ingredient List</h2>
                            <ul>
                              {
                                hit.recipe.ingredientLines.map((ingredient,idx4) => (
                                    <li key={idx4}>{ingredient}</li>
                                ))
                              }
                            </ul>
                          </div>
                        </div>
                      </article>
                    ))
                }
                </section>
              }
            </main>
            <footer className="footer">
              &copy; 2023 Erin Keller
            </footer>
        </div>
    );
}
}
   
export default App;
