import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1)
        return null;
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxDisplayed = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxDisplayed / 2));
        const endPage = Math.min(totalPages, startPage + maxDisplayed - 1);
        if (endPage - startPage + 1 < maxDisplayed) {
            startPage = Math.max(1, endPage - maxDisplayed + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };
    const pages = getPageNumbers();
    return (<div className="flex items-center gap-1 md:gap-2 rounded-3xl">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="h-10 rounded-3xl border-2">
                <ChevronLeft />
            </Button>

            {pages[0] > 1 && (<>
                    <Button variant="outline" size="sm" onClick={() => onPageChange(1)} className="h-10 w-10 md:h-11 md:w-11 rounded-3xl font-black uppercase tracking-widest text-[9px] md:text-[10px] border-2 hover:border-primary transition-colors">
                        1
                    </Button>
                    {pages[0] > 2 && <span className="text-muted-foreground">...</span>}
                </>)}

            {pages.map(page => (<Button key={page} variant="outline" size="sm" onClick={() => onPageChange(page)} className={`h-10 w-10 md:h-11 md:w-11 rounded-3xl font-black uppercase tracking-widest text-[9px] md:text-[10px] ${currentPage === page
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 transition-all'
                : 'border-2 hover:border-primary transition-colors'}`}>
                    {page}
                </Button>))}

            {pages[pages.length - 1] < totalPages && (<>
                    {pages[pages.length - 1] < totalPages - 1 && <span className="text-muted-foreground">...</span>}
                    <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} className="h-10 w-10 md:h-11 md:w-11 rounded-3xl font-black uppercase tracking-widest text-[9px] md:text-[10px] border-2 hover:border-primary transition-colors">
                        {totalPages}
                    </Button>
                </>)}

            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="h-10 rounded-3xl border-2">
                <ChevronRight className="w-4 h-4"/>
            </Button>
        </div>);
}
