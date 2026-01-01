import { stringify } from "csv-stringify";
import type { Response } from "express";

export function streamCSV(res: Response, rows: any[]) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=todos.csv");

    const converter = stringify({
        header: true,
    });

    converter.pipe(res);
    rows.forEach(row => converter.write(row));
    converter.end();
}