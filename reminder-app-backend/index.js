require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/reminderAppDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("DB connected"))
.catch((err) => console.error(err));

setInterval(() => {
    Reminder.find({})
    .then((reminderList) => {  
    if (err) {
      console.log(err);
    }
    if (reminderList) {
      reminderList.forEach(reminder => {
        if (!reminder.isReminded){
          const now = new Date();
          if ((new Date(reminder.remindAt) - now) < 0){
            Reminder.findByIdAndUpdate(reminder._id, {isReminded: true}, (err, remindDb) => {
              if (err){
                console.log(error)
              }
            });
          }
        }
      });
    }
  });
}, 1000);

const reminderSchema = new mongoose.Schema({
  reminderMsg: String,
  remindAt: String,
  isReminded: Boolean
});

const Reminder = mongoose.model("reminder", reminderSchema);

app.get("/getAllReminder", (req, res) => {
  Reminder.find({}, (err, reminderList) => {
    if (err) {
      console.log(err);
    }
    if (reminderList) {
      res.send(reminderList);
    }
  });
});

app.post("/addReminder", (req, res) => {
  const { reminderMsg, remindAt } = req.body;
  const reminder = new Reminder({
    reminderMsg,
    remindAt,
    isReminded: false
  });
  reminder.save((err, reminder) => {
    if (err) {
      console.log(err);
    }
    if (reminder) {
      res.send(reminder);
    }
  });
});

app.post("/deleteReminder", (req, res) => {
  const id = req.body.id;
  Reminder.deleteOne({_id: id}, () => {
    Reminder.find({}, (err, reminderList) => {
      if (err) {
        console.log(err)
      }
      if (reminderList) {
        res.send(reminderList)
      }
    });
  });
});

app.get("/", (req, res) => {
  res.send("A message from be");
});

app.listen(9000, () => console.log("Be started"));
