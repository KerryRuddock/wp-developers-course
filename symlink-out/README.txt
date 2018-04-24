gitbash supposedly handles symlinks, but when I tried all that was saved to the repository was
the symbolic file and not the data itself. 

As Recommeneded in https://stackoverflow.com/questions/5917249/git-symlinks-in-windows?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
reverse the strategy and add symbolic links pointing out of the repo.

C:\Users\KBR\Local Sites\wp-university\app\public\wp-content\mu-plugins\university-post-types.php
now resides in symlinks-out folder

