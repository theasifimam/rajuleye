import React from 'react';
export default function NotFound() {
    return (<div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
            <p className="text-muted-foreground">The resource you requested could not be found.</p>
        </div>);
}
