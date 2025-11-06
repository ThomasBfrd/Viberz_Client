import './profile-picture.scss';

interface ProfilePictureProps {
    image: string;
    width?: number;
    height?: number;
}

const ProfilePicture = ({image, width, height}: ProfilePictureProps) => {
    return (
        <div className="profile-image" data-testid="profile-image">
            <img src={image} width={width} height={height} alt="user-profile" data-testid="profile-image-source" />
        </div>
    )
}

export default ProfilePicture;