import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="currentColor"
                d="M12 2L4 10h16L12 2zm0 4L4 14h16L12 6zm0 4L4 18h16L12 10zm0 4L4 22h16L12 14z"
            />
        </svg>
    );
}
