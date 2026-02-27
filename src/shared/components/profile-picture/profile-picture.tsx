import './profile-picture.scss';

interface ProfilePictureProps {
    image: string;
    width?: string;
    height?: string;
}

const ProfilePicture = ({image, width, height}: ProfilePictureProps) => {
    return (
        <div className="profile-image" style={{height: height, width: width}} data-testid="profile-image">
            <img src={image} alt="user-profile" data-testid="profile-image-source" />
        </div>
    )
}

export default ProfilePicture;