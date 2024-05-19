class DropContributionsWalls < ActiveRecord::Migration[7.0]
  def change
    drop_table :contributions_walls, if_exists: true
  end
end
