class CreateWalls < ActiveRecord::Migration[7.0]
  def change
    create_table :walls do |t|
      t.references :owner, null: false, foreign_key: { to_table: :users }
      t.text :context
      t.datetime :end_time

      t.timestamps
    end
  end
end
