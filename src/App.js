import "./App.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);
  const [page, setPage] = useState(1);

  const handleClick = useCallback((index, item) => {
    setIndex(index);
  }, []);

  const fetchImages = useCallback(() => {
    axios
      .get(
        `https://api.unsplash.com/photos/?client_id=v5M8YbalIAM6nS2IU07YMKKc1UGlaqkIVJOT69R-hnk&page=${page}&per_page=30`
      )
      .then((res) => {
        const data = res.data;
        const photos = data.map((d, index) => {
          return {
            src: d.urls.small_s3,
            width: d.width,
            height: d.height,
            alt: d.alt_description,
          };
        });
        const newImages = images.concat(photos);
        setImages(newImages);
        setPage(page + 1);
      });
  }, [page, images]);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSelect = useCallback(
    (index, item, event) => {
      const nextImages = images.map((image, i) =>
        i === index ? { ...image, isSelected: !image.isSelected } : image
      );
      setImages(nextImages);
    },
    [images]
  );

  return (
    <InfiniteScroll
      dataLength={images.length}
      next={fetchImages}
      hasMore={true}
      loader={
        <p style={{ textAlign: "center" }}>
          <b>Loading...</b>
        </p>
      }
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <Gallery images={images} onSelect={handleSelect} onClick={handleClick} />
      {index >= 0 && (
        <Lightbox
          open={index >= 0}
          close={() => {
            setIndex(-1);
          }}
          slides={images}
          index={index}
        />
      )}
    </InfiniteScroll>
  );
}

export default App;
