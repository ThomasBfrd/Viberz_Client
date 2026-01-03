interface PauseIconProps {
    height?: string;
    width?: string;
    fill?: string;
}

const PauseIcon = ({height = "20px", width = "20px", fill="none"}: PauseIconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16"
             fill={fill}>
            <path d="M7 1H2V15H7V1Z" fill="#fff"/>
            <path d="M14 1H9V15H14V1Z" fill="#fff"/>
        </svg>
    );
}

export default PauseIcon;