create table word_sentence(
    id int not null auto_increment,
    word_id int not null,
    sentence_id int not null,
    primary key(id),
    foreign key(word_id) references words(id),
    foreign key(sentence_id) references sentences(id)
)