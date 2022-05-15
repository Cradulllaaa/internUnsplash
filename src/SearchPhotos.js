import {React, useState} from "react";
import { createApi, toJson } from "unsplash-js";
import Modal from 'react-modal';


const unsplash = createApi({
  accessKey: 'r4xhzXDOXTyCXV1JH7tA7O_fnFTkmOZTKZpmiZ6FhYc',
  // `fetch` options to be sent with every request
  headers: { 'X-Custom-Header': 'foo' },
});

export default function SearchPhotos() {

  const [query, setQuery] = useState("");
  const [pics, setPics] = useState([]);
  const [SelectedPic, setSelected] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
		e.preventDefault();
    const q = {
      query: query,
      perPage: 100
    }
    unsplash.search
      .getPhotos(q)
      .then((res)=>{
        if(res.errors){
          console.log("Not found");
        }else{
          const photo = res.response;
          console.log(photo.results);
          setPics(photo.results);
        }
      });
	};

  function openModal(id) {
    console.log(id)
    setIsOpen(true);
    // console.log(pic);
    unsplash.photos.get({photoId: id}).then((res)=>{
      if(res.errors){
        console.log("Nope");
      }else{
        const photo = res.response;
        console.log(photo);
        setSelected(photo);
      }
    });
    // modal.style.display = "block";
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    
  }

  function closeModal() {
    setIsOpen(false);
  }



  // When the user clicks on <span> (x), close the modal
  var closeF = function() { 
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }
  return (
    <>
    <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
      {
        SelectedPic && 
        <div>
        <div className="card" key={SelectedPic.id}>
            <img
                className="card--image"
                alt={SelectedPic.alt_description}
                src={SelectedPic.urls.full}
                width="50%"
              ></img>
        </div>
        <h1> {SelectedPic.alt_description} </h1>
        <div class="caption">
          <div class = "img-text">
            <a href = {SelectedPic.user.links.html}> {SelectedPic.user.first_name  + " " + SelectedPic.user.last_name}</a>
          </div>
          <div class = "likes">
            <span> {"Likes : "+ SelectedPic.likes}</span>
          </div>
        </div>
        <button onClick={closeModal}>Close </button>
        </div>
        
      }
    </Modal>
    <div className="searchElem">
      <form className="form">
        <label className="label" htmlFor="query"> 
          {" "}
          📷
        </label>
        <input
          type="text"
          name="query"
          className="input"
          placeholder={`Try "dog" or "apple"`}
          value = {query}
          onChange={(e)=> setQuery(e.target.value)}
        />
        <button type="submit" className="button" 
        onClick={handleSubmit}>
          Search
        </button>
      </form>
    </div>
    <div className="card-list">
        {
          pics.map((pic) =>
          <div className="card" key={pic.id} onClick={(e) => openModal(pic.id)}>
            <div class="image-card">
            <img
                className="card--image"
                alt={pic.alt_description}
                src={pic.urls.small}
                width="100%"
                // height=%"
              ></img>
              <div class="caption">
                <div class = "img-text">
                  <a href = {pic.user.links.html}> {pic.user.first_name  + " " + pic.user.last_name}</a>
                </div>
                <div class = "likes">
                  <span> {"Likes : "+ pic.likes}</span>
                </div>
              </div>
              
              </div>
          </div>
          )}
    </div>
    </>
  );
}