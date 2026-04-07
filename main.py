from flask import Flask, redirect, url_for, render_template, request
from flask_wtf import FlaskForm
from flask_ckeditor import CKEditor
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Text
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_ckeditor import CKEditorField
from flask_bootstrap import Bootstrap5
import calendar
from flask import jsonify
from datetime import datetime
import os

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
app.secret_key = "secret"
basedir = os.path.abspath(os.path.dirname(__file__))
Bootstrap5(app)
ckeditor = CKEditor(app)
#place where db is stored
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'sqlite:///' + os.path.join(basedir, 'instance', 'data.db')
# initialize the app with the extension
db.init_app(app)

#text class where long texts are stored
class Notes(db.Model):
    __tablename__ = "notes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(250), unique=False, nullable=False)
    date = db.Column(db.DateTime, default = datetime.now)
    body: Mapped[str] = mapped_column(Text, nullable=False)

class CreateNoteForm(FlaskForm):
    title = StringField("Blog Post Title", validators=[DataRequired()])
    body = CKEditorField("Note content", validators=[DataRequired()])
    submit = SubmitField("Add a note")

with app.app_context():
    db.create_all()


@app.route('/', methods = ['GET', 'POST'])
def main():
    return render_template("index.html")

@app.route('/circle-of-fifths', methods = ['GET', 'POST'])
def circle():
    return render_template("circle.html")

@app.route('/theory-n-practice', methods = ['GET', 'POST'])
def theory_n_practice():
    return render_template("theory_n_practice.html")

@app.route('/api/scale/<key>/<scale_type>')
def get_scale(key, scale_type):
    keys = ['E','F','F♯','G','G♯','A','A♯','B','C','C♯','D','D♯']
    if scale_type == "major":
        scale_pattern = [0,2,2,1,2,2,2,1]
    else:
        scale_pattern = [0,2,1,2,2,1,2,2]
    e_standard = [0,5,10,3,7,0]
    w_list = []
    final_placements = []
    c_place = 0
    for n in e_standard:
        whole_scale = []
        for i in keys:
            a_placement = (keys.index(i)+n) % 12
            whole_scale.append(keys[a_placement])
        w_list.append(whole_scale)
    for n in w_list:
        placement = n.index(key)
        c_list = []
        for i in scale_pattern:
            c_place += i
            b_place = (placement + c_place) % 12
            if b_place == 0:
                c_list.append(0)
                c_list.append(12)
            else:
                if b_place < 4:
                    c_list.append(b_place)
                    c_list.append(b_place+12)
                else:
                    c_list.append(b_place)
        f_list = []
        for c in c_list:
            if c not in f_list:
                f_list.append(c)
        final_placements.append(f_list)
    return jsonify(final_placements)

@app.route('/notes', methods=['GET', 'POST'])
def notes_redirect():
    now = datetime.now()
    return redirect(url_for('notes', 
                            note_year=now.year, 
                            note_month=now.strftime('%B'), 
                            note_day=now.day))

@app.route('/notes/<int:note_year>/<string:note_month>/<int:note_day>', methods=['GET', 'POST'])
def notes(note_year, note_month, note_day):
    month_num = int(datetime.strptime(note_month, "%B").strftime("%m"))
    cal = calendar.monthcalendar(note_year, month_num)
    now = datetime.now()
    prevnotes = db.session.execute(
    db.select(Notes).filter(
        db.extract('month', Notes.date) == month_num,
        db.extract('year', Notes.date) == note_year,
        db.extract('day', Notes.date) == note_day
    )
).scalars()
    list_of_dates = []
    dates = db.session.execute(db.select(Notes.date).filter(db.extract('year', Notes.date) == note_year,
                                                            db.extract('month', Notes.date) == month_num)).scalars().all()
    prev_month = month_num - 1
    next_month = month_num + 1
    prev_year = note_year
    next_year = note_year
    if month_num == 1:
        prev_month = 12
        prev_year = note_year - 1
    elif month_num == 12:
        next_month = 1
        next_year = note_year + 1
    prev_month = calendar.month_name[prev_month]
    next_month = calendar.month_name[next_month]
    for day in dates:
        list_of_dates.append(day.day)
    if request.method == 'POST':
        title = request.form.get('user_title') or f'{note_day} of {note_month}, {note_year}'
        if now.year != note_year or now.month != month_num or now.day != note_day:
            new_post = Notes(
            title=f'{title} (added later)',
            body=request.form.get('user_content'),
            date=datetime(note_year, month_num, note_day, 00, 00)
            )            
        else:
            new_post = Notes(
            title=title,
            body=request.form.get('user_content'),
            date=now
            )
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for("notes", note_year=note_year, note_month=note_month, note_day=note_day))
    context = {
    "cal": cal,
    "note_day": note_day,
    "note_month": note_month,
    "note_year": note_year,
    "prevnotes": prevnotes,
    "list_of_dates": list_of_dates,
    "prev_month": prev_month,
    "next_month": next_month,
    "prev_year": prev_year,
    "next_year": next_year}
    return render_template("notes.html", **context)

if __name__ == "__main__":
    app.run(debug=True)