import "./App.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function App() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);

  const handleClick = useCallback((index, item) => {
    setIndex(index);
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://api.unsplash.com/photos/?client_id=v5M8YbalIAM6nS2IU07YMKKc1UGlaqkIVJOT69R-hnk&page=2"
      )
      .then((res) => {
        const data = res.data;
        const photos = data.map((d, index) => {
          return {
            src: d.urls.raw,
            width: d.width,
            height: d.height,
            alt: d.alt_description,
            key: index,
          };
        });
        setImages(photos);
      });
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
    <>
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
    </>
  );
}

export default App;
