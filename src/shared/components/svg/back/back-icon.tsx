interface BackIconProps {
    height?: string;
    width?: string;
    fill?: string;
}

const BackIcon = ({height = "40px", width = "40px", fill = "#fff"}: BackIconProps) => {
    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height={height} width={width} fill={fill} x="0px" y="0px" viewBox="0 0 122.88 75.32" xmlSpace="preserve">
            <g>
                <polygon points="0,37.66 37.99,75.32 37.99,51.08 122.88,51.08 122.88,24.24 37.99,24.24 37.99,0 0,37.66"/>
        </g>
</svg>
    )
}

export default BackIcon;