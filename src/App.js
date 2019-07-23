import React,{Component} from 'react';
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import InfiniteCarousel from "react-leaf-carousel";

class App extends Component {
  state = {
    albums: [],
    albumsLength: 100
  };
  pageNumber = 1;
  limit = 10;

  componentDidMount() {
    // this.getAlbums();
  }

   getAlbums = async () => {
    axios
      .get(
        `https://jsonplaceholder.typicode.com/albums?_page=${
          this.pageNumber
        }_limit=1`
      )
      .then(res => {
        let albums = [...this.state.albums];
        if (res.data) {
          // let photosInAlbum = [];
          // console.log('data',res.data)
          let alteredAlbumItems = [];

          Promise.all(
            res.data.map(item => {
              let url = `https://jsonplaceholder.typicode.com/photos?albumId=${
                item.id
              }`;
              return axios
                .get(url)
                .then(resp => {
                  item.photosInAlbum = resp.data;
                  alteredAlbumItems.push(item);
                  // albums.push(...alteredAlbumItems);
                })
                .catch(err => {
                  console.log("----", err);
                });
            })
          ).then(() => {
            albums.push(...alteredAlbumItems);
            this.setState({ albums })
          });

          this.limit += 10;
          this.pageNumber++;
        }
      })
      .catch(err => {
        console.log("some error has occured. ");
      });
  };
  getPhotosInAlbums = albums => {};
   render() {
    return (
      <div className="container">
        <InfiniteScroll
          pageStart={0}
          loadMore={this.getAlbums}
          hasMore={this.state.albumsLength >= this.limit}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          {this.state.albums.map(album => {
            return (
              <div key={album.id}>
                <h5>Title : {album.title}</h5>
                <p>id : {album.id} userId : {album.userId}</p>
                <InfiniteCarousel
                  breakpoints={[
                    {
                      breakpoint: 500,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                      }
                    },
                    {
                      breakpoint: 768,
                      settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                      }
                    }
                  ]}
                  dots={true}
                  showSides={true}
                  sidesOpacity={0.5}
                  sideSize={0.1}
                  slidesToScroll={4}
                  slidesToShow={4}
                  scrollOnDevice={true}
                >
                  {album.photosInAlbum.map(pic => {
                    return (
                      <div key={pic.id}>
                        <img src={pic.thumbnailUrl} alt="images"/>
                        <p><strong>Title:</strong> {pic.title}</p>
                        <h6><strong>Id:</strong> {pic.id}</h6>
                      </div>
                    );
                  })}
                </InfiniteCarousel>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }
  
}

export default App;
