import React, { useState } from "react";
import { AiTwotoneDelete, AiOutlineExclamationCircle } from 'react-icons/ai';

import api from "../../Services/api";

function Notes({ data, handleDelete, handleChangePriority }) {
    const [ changedNote, setChangedNote ] = useState('');

    async function handleEdit(e, priority) {
        e.style.cursor = 'text';
        e.style.borderRadius = '5px';

        if (priority) {
            e.style.boxShadow = '0 0 5px white';
        } else {
            e.style.boxShadow = '0 0 5px gray';
        }
    }

    async function handleSave(e, notes) {
        e.style.cursor = 'default';
        e.style.boxShadow = 'none';

        if (changedNote && changedNote !== notes) {
            await api.put(`/api/annotations/${data._id}`, {
                title: data.title,
                notes: changedNote,
                priority: data.priority
            });
        }
    }

    return (
        <li className={data.priority ? "notepad-infos-priority" : "notepad-infos"}>
            <div>
              <strong>{data.title}</strong>

              <div>
                <AiTwotoneDelete onClick={() => handleDelete(data._id)} size="24" />
              </div>
            </div>

            <textarea defaultValue={data.notes} onClick={e => handleEdit(e.target, data.priority)} onChange={e => setChangedNote(e.target.value)} onBlur={e => handleSave(e.target, data.notes)} />
            <span>
                <AiOutlineExclamationCircle onClick={() => handleChangePriority(data._id)} size="24" />
            </span>
        </li>
    )
}

export default Notes;