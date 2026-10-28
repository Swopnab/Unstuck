import {type Assignment,addDays,isDate} from './model.ts';
const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
// Fold by UTF-8 octets, never through a Unicode character (RFC 5545).
function fold(line:string){let out='',bytes=0;for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>75){out+='\r\n ';bytes=1;}out+=char;bytes+=size;}return out;}
export function assignmentCalendar(assignments:Assignment[],now=new Date()){
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Unstuck//Assignment deadlines//EN','CALSCALE:GREGORIAN'];
 for(const a of assignments){if(!isDate(a.due))throw Error('Invalid calendar deadline');lines.push('BEGIN:VEVENT',`UID:${escape(a.id)}@unstuck.local`,`DTSTAMP:${now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;VALUE=DATE:${a.due.replace(/-/g,'')}`,`DTEND;VALUE=DATE:${addDays(a.due,1).replace(/-/g,'')}`,`SUMMARY:${escape(a.title)} deadline`,`DESCRIPTION:${escape(a.course+' — Deadline only; this does not reserve study time or change your course deadline.')}`,'END:VEVENT');}
 lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
}
