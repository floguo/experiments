import { parseSVG, makeAbsolute } from 'svg-path-parser';

// Helper function for linear interpolation of SVG path
const interpolatePoints = (x1, y1, x2, y2, steps) => {
    const points = [];
    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        points.push([
            x1 + t * (x2 - x1), // Interpolated x
            y1 + t * (y2 - y1)  // Interpolated y
        ]);
    }
    return points;
}

// Helper function for arc interpolation
const interpolateArc = (x0, y0, rx, ry, startAngle, endAngle, steps) => {
    const points = [];
    const angleStep = (endAngle - startAngle) / steps;

    for (let i = 0; i <= steps; i++) {
        const angle = startAngle + i * angleStep;
        const x = x0 + rx * Math.cos(angle); // x = centerX + radiusX * cos(angle)
        const y = y0 + ry * Math.sin(angle); // y = centerY + radiusY * sin(angle)
        points.push([x, y]);
    }

    return points;
};

// Add more points for curves
export const convertSvgPathToCoordinates = (svgPath, rows, cols) => {
    const commands = parseSVG(svgPath);
    const pathData = makeAbsolute(commands);
    const points = [];
    const interpolationSteps = 50;
    let isFirstPathComplete = false; // Flag to stop after the first closed path in SVG
    
    // Add more points for curves
    pathData.forEach((cmd, index) => {
        if (isFirstPathComplete) return; // Stop processing additional sub-paths

        if (cmd.code === 'Z') {
            isFirstPathComplete = true; // Mark the end of the first path
            return; // Don't process further commands after 'Z'
        }

        switch (cmd.code) {
            case 'A': // Arc
                if (cmd.x0 !== undefined && cmd.y0 !== undefined && cmd.rx !== undefined && cmd.ry !== undefined) {
                    // Add start point
                    points.push([cmd.x0, cmd.y0]);

                    // Interpolate arc points
                    const startAngle = 0; // Assume the arc starts at 0 radians (adjust if needed)
                    const endAngle = Math.PI; // Assume 180 degrees for now (adjust for your SVG path)
                    const interpolatedArc = interpolateArc(cmd.x0, cmd.y0, cmd.rx, cmd.ry, startAngle, endAngle, interpolationSteps);
                    points.push(...interpolatedArc);

                    // Add end point
                    if (cmd.x !== undefined && cmd.y !== undefined) {
                        points.push([cmd.x, cmd.y]);
                    }
                }
                break;

            case 'Q': // Quadratic curve
                if (cmd.x0 !== undefined && cmd.y0 !== undefined) {
                    // Add the start point
                    points.push([cmd.x0, cmd.y0]);
    
                    // Add interpolated points for smoother curves
                    const interpolated = interpolatePoints(cmd.x0, cmd.y0, cmd.x, cmd.y, interpolationSteps); 
                    points.push(...interpolated);
                }
    
                // Add the end point
                if (cmd.x !== undefined && cmd.y !== undefined) {
                    points.push([cmd.x, cmd.y]);
                }
                break;
    
            default:
                // Handle all other commands (e.g., lines)
                if (cmd.x !== undefined && cmd.y !== undefined) {
                    points.push([cmd.x, cmd.y]);
                }
        }
    });

    const minX = Math.min(...points.map(p => p[0]));
    const maxX = Math.max(...points.map(p => p[0]));
    const minY = Math.min(...points.map(p => p[1]));
    const maxY = Math.max(...points.map(p => p[1]));

    const scaleX = (rows - 1) / (maxX - minX);
    const scaleY = (cols - 1) / (maxY - minY);

    const scaledPoints = points.map(([x,y]) => [
    Math.round((y - minY) * scaleY ),
    Math.round((x - minX) * scaleX )
    ]);

    return scaledPoints;
}