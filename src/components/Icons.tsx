import * as React from "react";

interface IIconProps {
    fill: string
}


function CrossIcon(props: IIconProps) {
    return (
        <svg style={{ width: "1.4em", height: "auto", display: "block" }} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" x="0px" y="0px">
            <path style={{ fill: "#1d1d1b" }} d="M274.1,256.3L432.8,97.6c5.1-5.1,5.1-13.3,0-18.4l0,0c-5.1-5.1-13.3-5.1-18.4,0L255.7,237.9L97.6,79.8
	                                c-5.1-5.1-13.3-5.1-18.4,0h0c-5.1,5.1-5.1,13.3,0,18.4l158.1,158.1L79.2,414.4c-5.1,5.1-5.1,13.3,0,18.4l0,0
	                                c5.1,5.1,13.3,5.1,18.4,0l158.1-158.1l158.7,158.7c5.1,5.1,13.3,5.1,18.4,0h0c5.1-5.1,5.1-13.3,0-18.4L274.1,256.3z" />
        </svg>
    )
}

function SearchIcon(props: IIconProps) {
    return (
        <svg style={{ width: "1.4em", height: "auto", display: "block", margin: "auto" }} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" x="0px" y="0px">
            <path style={{ fill: "#1d1d1b" }} d="M431.2,412.8L324.7,306.3c20.2-24.3,32.3-55.4,32.3-89.3c0-77.2-62.8-140-140-140S77,139.8,77,217
	s62.8,140,140,140c33.9,0,65.1-12.1,89.3-32.3l106.5,106.5c2.5,2.5,5.9,3.8,9.2,3.8s6.7-1.3,9.2-3.8
	C436.3,426.1,436.3,417.9,431.2,412.8z M217,331c-62.9,0-114-51.1-114-114c0-62.9,51.1-114,114-114c62.9,0,114,51.1,114,114
	C331,279.9,279.9,331,217,331z" />
        </svg>
    )
}

export {
    CrossIcon,
    SearchIcon 
}
    