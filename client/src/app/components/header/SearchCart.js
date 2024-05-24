import SearchCard from "./SearchCard";
import './SearchCart.css';

const SearchCart = ({ games, users }) => {
    if (!games || !users || (games.length === 0 && users.length === 0)) {
        return (
            <div className="search-cart">
                <label className="search-cart-category">No results</label>
            </div>
        )
    }

    return (
        <div className="search-cart">
            {games.length > 0 &&
                <div className="search-cart-category">
                    <label className="search-cart-category-label">Jeux</label>
                    <div className="search-cart-items">
                        {games.map((game) => (
                            <SearchCard key={game.id} image={game.image} title={game.title} url={game.url} />
                        ))}
                    </div>
                </div>
            }
            {
                games.length > 0 && users.length > 0 &&
                <div className="search-cart-separator"></div>
            }
            {users.length > 0 &&
                <div className="search-cart-category">
                    <label className="search-cart-category-label">Utilisateurs</label>
                    <div className="search-cart-items">
                        {users.map((user) => (
                            <SearchCard key={user.id} image={user.image} title={user.title} url={user.url} />
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default SearchCart;