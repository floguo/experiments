import Marquee from './Marquee';
import { shapes } from './shapes';
import { convertSvgPathToCoordinates } from './pathProcessor';

// Specifies which props are required for the component
const SvgPathToCoordinates = ({ rows, cols }) => {
    const coordinates = convertSvgPathToCoordinates(shapes.heart, rows, cols);
    return <Marquee coordinates={coordinates} rows={rows} cols={cols} />;
};