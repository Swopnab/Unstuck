import test from 'node:test';
import assert from 'node:assert/strict';
import {assignmentCalendar} from '../src/calendar.ts';
const assignment={id:'stable-id',title:'Essay, draft; notes\nBEGIN:VEVENT',course:'Art',due:'2028-02-29',sample:false,steps:[]};
test('calendar keeps stable IDs, leap dates, exclusive end and escaping',()=>{
 const value=assignmentCalendar([assignment],new Date('2026-10-28T12:00:00Z'));
 assert.ok(value.includes('UID:stable-id@unstuck.local\r\n'));
 assert.ok(value.includes('DTSTART;VALUE=DATE:20280229\r\n'));
 assert.ok(value.includes('DTEND;VALUE=DATE:20280301\r\n'));
 assert.equal(value.split('\r\n').filter(s=>s==='BEGIN:VEVENT').length,1);
 assert.ok(value.includes('Essay\\, draft\\; notes\\nBEGIN:VEVENT deadline'));
});
test('calendar folds Unicode at 75 bytes and rejects invalid dates',()=>{
 const value=assignmentCalendar([{...assignment,title:'📚'.repeat(80)}]);
 for(const line of value.split('\r\n'))assert.ok(new TextEncoder().encode(line).length<=75);
 assert.throws(()=>assignmentCalendar([{...assignment,due:'2027-02-29'}]));
 assert.equal((assignmentCalendar([]).match(/BEGIN:VEVENT/g)||[]).length,0);
});
