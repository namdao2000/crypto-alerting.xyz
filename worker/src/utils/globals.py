import queue

global update_price_queue, alert_queue
update_price_queue = queue.Queue()
alert_queue = queue.Queue()
currently_updating = set()


