import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Card from "./Card";
import "./PublicationPage.css";
import { Link } from "react-router-dom";

export const shortenAddress = (address) => {
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};
const Dummypublications = [
  {
    title: "Publication 1",
    description: "This is the description of Publication 1.",
    ownerAddress: "0x1aBcDeFgHiJkLmNoPqRsTuVwXyZ",
  },
  {
    title: "Publication 2",
    description: "This is the description of Publication 2.",
    ownerAddress: "0x2bCdEfGhIjKlMnOpQrStUvWxYz",
  },
  {
    title: "Publication 3",
    description: "This is the description of Publication 3.",
    ownerAddress: "0x3cDeFgHiJkLmNoPqRsTuVwXyZaB",
  },
  {
    title: "Publication 4",
    description: "This is the description of Publication 4.",
    ownerAddress: "0x4dEfGhIjKlMnOpQrStUvWxYzAbCd",
  },
];

const PublicationPage = ({ state, setid }) => {
  const [publications, setPublications] = useState([]);
  const { contract } = state;

  const changeToInt = (_x) => {
    const x = ethers.utils.formatEther(_x) * 10 ** 18;
    return x;
  };

  useEffect(() => {
    const showPublications = async (e) => {
      // e.preventDefault();
      console.log("hello");
      const { contract } = state;
      const l = await contract.publicationCounter.call();
      console.log(l);
      const ll = changeToInt(l);
      console.log(ll);
      let pus = [];
      for (let i = 1; i <= ll; i++) {
        const data = await contract.publications(i);
        console.log(data);
        pus.push(data);
      }
      setPublications(pus);
      console.log(pus);
    };
    contract && showPublications();
  }, [contract]);

  const contributeFunds = async (_id) => {
    try {
      const provider = ethers.getDefaultProvider();
      const signer = provider.getSigner();

      const tx = await contract.contributeFunds(_id, {
        value: ethers.utils.parseEther("0.001"),
      });

      await tx.wait();
      console.log("Contribution successful");
    } catch (error) {
      console.error("Error occurred during contribution:", error);
    }
  };

  return (
    <div className="publication-page">
      <h1 className="page-title">Publications</h1>
      <div className="publication-list">
        {publications.map((publication, index) => (
          <>
            <div className="card">
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title">{publication.title}</h3>
                  <p className="card-description">{publication.description}</p>
                  <p className="card-owner">{shortenAddress(publication.researcher)}</p>
                </div>
                <div className="card-actions">
                  <Link to="/pub01">
                    <button className="card-button" onClick={()=>{setid(changeToInt(publication.id))}}>View More</button>
                  </Link>
                  <button className="card-button">Contribute</button>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default PublicationPage;

/*
{/* <Link to='/pub01'> 
<button onClick={console.log(changeToInt(publication.id))}>
View
</button>
{/* </Link> 
<Card
            key={index}
            title={publication.title}
            description={publication.description}
            ownerAddress={shortenAddress(publication.researcher)}
          />
*/
