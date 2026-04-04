import mongoose from "mongoose";


const expenseSchema = new mongoose.Schema({
   
  userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
          required: true
      },
      title:{
          type: String,
          required: true,
          trim: true,
          maxlength: 100
      },
      amount:{
          type: Number,
          required: true,
          trim: true, 
      },
      //type:{
        //  type: String,
          //default: "income"
      //},
      date:{
          type: Date,
          required: true
      },
      category:{
          type: String,
          required: true
      },
      description:{
          type: String,
          trim: true,
          maxlength: 500
      }
}, {timestamps: true})

export const expenseModel = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
export default expenseModel;



