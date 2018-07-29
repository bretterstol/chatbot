create table words(
    id int not null auto_increment,
    word varchar(50) not null unique,
    word_count int default 0,
    primary key(id)
); 