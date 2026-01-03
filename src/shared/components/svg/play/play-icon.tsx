import "./play-icon.scss";

interface PlayIconProps {
    height?: string;
    width?: string;
    fill?: string;
    circle?: boolean;
}

const PlayIcon = ({height = "40px", width = "40px", fill = "#fff", circle=true}: PlayIconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 512 512">
            {circle ? (
                <path
                    fill={fill}
                    d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
                                C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
                                c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
                                l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"
                />
            ) : (
                <polygon className="polygon" fill={fill} style={{fillRule: "evenodd", clipRule:"evenodd"}} points="92.2,60.97 0,122.88 0,0 92.2,60.97"/>
            )}
        </svg>
    )
}

export default PlayIcon;