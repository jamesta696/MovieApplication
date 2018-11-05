import React, { Component } from "react";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listgroup";
import Pagination from "./common/pagination";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Movies extends Component {
    state = {
        movies: [],
        genres: [],
        currentPage: 1,
        pageSize: 4,
        sortColumn: { path: "title", order: "asc" }
    };

    componentDidMount() {
        const genres = [
            {
                _id: "",
                name: "All Genres"
            },
            ...getGenres()
        ];
        this.setState({ movies: getMovies(), genres });
    }

    onHandleDeleteMovie = movie => {
        const movies = this.state.movies.filter(m => m._id !== movie._id);
        this.setState({ movies });
        console.log(movie);
    };

    onHandleLiked = movie => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] };
        movies[index].liked = !movies[index].liked; // Toggle Liked
        this.setState({ movies });
    };

    onHandlePageChange = page => {
        this.setState({ currentPage: page });
    };

    onHandleGenreSelected = genre => {
        this.setState({ selectedGenre: genre, currentPage: 1 });
    };

    onHandleSort = sortColumn => {
        this.setState({ sortColumn });
    };

    render() {
        const { length: count } = this.state.movies;
        const {
            pageSize,
            currentPage,
            selectedGenre,
            sortColumn,
            movies: allMovies
        } = this.state;

        if (count === 0) return <p>There are no movies in the database.</p>;

        const filtered =
            selectedGenre && selectedGenre._id
                ? allMovies.filter(m => m.genre._id === selectedGenre._id)
                : allMovies;

        const sorted = _.orderBy(
            filtered,
            [sortColumn.path],
            [sortColumn.order]
        );

        const movies = paginate(sorted, currentPage, pageSize);

        return (
            <div className="row">
                <div className="col-3">
                    <ListGroup
                        items={this.state.genres}
                        onItemSelect={this.onHandleGenreSelected}
                        selectedItem={this.state.selectedGenre}
                    />
                </div>
                <div className="col">
                    <p>Showing {filtered.length} movies in the database.</p>
                    <MoviesTable
                        movies={movies}
                        sortColumn={sortColumn}
                        onLike={this.onHandleLiked}
                        onDelete={this.onHandleDeleteMovie}
                        onSort={this.onHandleSort}
                    />

                    <Pagination
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={this.onHandlePageChange}
                        itemsCount={filtered.length}
                    />
                </div>
            </div>
        );
    }
}

export default Movies;
