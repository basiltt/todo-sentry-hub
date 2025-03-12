
import React, { useState } from "react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface TodoFormProps {
  onAdd: (text: string) => void;
  isLoading?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd, isLoading = false }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-6 animate-fade-in"
    >
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        disabled={isLoading}
        className="h-11"
      />
      <ButtonCustom
        type="submit"
        disabled={!text.trim() || isLoading}
        isLoading={isLoading}
        className="h-11 min-w-[100px]"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add
      </ButtonCustom>
    </form>
  );
};

export default TodoForm;
