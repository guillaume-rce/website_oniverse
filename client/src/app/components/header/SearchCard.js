import './SearchCard.css';

const SearchCard = ({ image, title, url }) => {
    return (
        <div className="search-card" onClick={() => window.location.href = url}>
            <img src={image} alt={title} className="search-card-image" />
            <label className="search-card-title">{title}</label>
        </div>
    )
}

export default SearchCard;