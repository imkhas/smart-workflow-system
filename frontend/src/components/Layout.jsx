
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="app-main">
                <Navbar />
                <div className="app-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
