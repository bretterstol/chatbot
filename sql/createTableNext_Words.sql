create table next_words(
    id int not null auto_increment,
    first_word_id int,
    second_word_id int,
    combination_count int default 0,
    primary key(id),
    foreign key(first_word_id) references words(id),
    foreign key(second_word_id) references words(id),
    constraint first_second unique(first_word_id, second_word_id)
)