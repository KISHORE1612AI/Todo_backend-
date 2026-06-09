"use client";
import { Todo } from "../types/todo";
import { Trash2 } from "lucide-react";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-yellow-50 text-yellow-600",
  low: "bg-green-50 text-green-600",
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3 ${todo.completed ? "opacity-60" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id)}
        className="mt-1 cursor-pointer accent-blue-600"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-gray-800 ${todo.completed ? "line-through text-gray-400" : ""}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-xs text-gray-400 mt-0.5">{todo.description}</p>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${priorityColors[todo.priority]}`}>
          {todo.priority}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo._id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}