create table books{
    id int not null auto_increment,
    title varchar(200) not null,
    author varchar(100) not null,
    release_date date,
    primary key(id)
}