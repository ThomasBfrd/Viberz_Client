import HeartIcon from "../svg/heart/heart-icon.tsx";
import "./track-list-item.scss";
import type {Track} from "../../interfaces/guess-song.interface.ts";
import type {Playlist} from "../../interfaces/playlist.interface.ts";

interface TrackListItemProps<T extends Playlist | Track> {
    item: T;
    cover: string;
    title: string;
    subtitle: string;
    genres?: string[];
    likes?: number;
    index: number;
    isListening?: { song: Track | undefined; isPlaying: boolean };
    itemClicked: (item: T) => void;
}

const TrackListItem = <T extends Playlist | Track,>({item, cover, title, subtitle, genres, likes, index, isListening, itemClicked}: TrackListItemProps<T>) => {
    return (
        <div className="track-list-item" key={item.id} onClick={() => itemClicked(item)}>
            <div className="track-list-item-count">
                { isListening?.isPlaying && isListening.song?.id === item.id ?
                    (
                    <span className="listen-track"></span>
                    ) : (
                    (index+1)
                    )
                }
            </div>
            <div className="track-list-item-cover">
                <img src={cover} alt="playlist-image"/>
            </div>
            <div className="track-list-item-infos">
                <p className="track-list-item-name">{title}</p>
                <p className="track-list-item-creator">
                    {subtitle} {genres ? <span> - {genres?.join(', ')}</span> : null}
                </p>
            </div>
            {likes !== undefined && likes >= 0 && (
                <div className="track-list-item-likes">
                    <div className="track-list-item-likes-icon">
                        <HeartIcon fill={'#e4e4e4'} />
                    </div>
                    <span className="track-list-item-like-text">{likes}</span>
                </div>
            )}
        </div>
    )
}

export default TrackListItem;