import React, { useState } from "react";
import { CustomFormInput } from "../FormInput";

type NewMember = {
  name: string;
};

type AddTeamMemberFormProps = {
  onAdd: (member: NewMember) => void;
};

export function AddTeamMemberForm({ onAdd }: AddTeamMemberFormProps) {
  const [formData, setFormData] = useState<NewMember>({
    name: "",
  });
  const [disable,setDisable]=useState<boolean>(true)
  const [count,setCount]=useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value.length >2){
        setDisable(false)
    }else{
        setDisable(true)
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onAdd(formData);
    setCount(prev => prev+1)
    setFormData({ name: "", });
    console.log({count});
    
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 bg-gray-50 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800">Add Team Member</h3>

      <CustomFormInput
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="John Doe"
        disabled={count >4}
        required
      />

      <button
        type="submit"
        disabled={disable || count >4}
        className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition font-medium cursor-pointer disabled:bg-gray-700"
      >
        Add Member
      </button>
    </form>
  );
}