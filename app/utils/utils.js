import { useState } from 'react';


const useFontSize = () => {
    const [fontSize, setFontSize] = useState({
        title: 48,
        button: 18,
        main: 24,
        buttonResize: 36,
    });

    return { fontSize, setFontSize };
};

export { useFontSize };
