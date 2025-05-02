import React from 'react';

type FootnoteProps = {
    lastUpdated?: string;
};

export function Footnote({ lastUpdated }: FootnoteProps) {
    return (
        <div className="mt-8 max-w-3xl mx-auto">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 font-serif">
                    <p className="flex items-start">
                        <span className="mr-1.5 inline-block font-medium align-top">*</span>
                        <span>Original data can be obtained from <a href="https://docs.google.com/spreadsheets/d/1cj5KaN1tGFhlzeWfigga-vHap0OHwNRu7jUlli1vJKA/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Sheet</a>.</span>
                    </p>
                    {lastUpdated && (
                        <p className="flex items-start">
                            <span className="mr-1.5 inline-block font-medium align-top">†</span>
                            <span>Last updated: {new Date(lastUpdated).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZoneName: 'short'
                            })}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
