import React from 'react';
import { Link } from 'react-router-dom';

const Data_Center = () => {
    return (
        <Link to="/src/components/Data_Center_911/templates/index.html">
            <iframe
                src="/src/components/Data_Center_911/templates/index.html"
                title="Embedded HTML"
                width="100%"
                height="650px"
                style={{ border: 'none' }}
            />
        </Link>
    );
};

export default Data_Center;